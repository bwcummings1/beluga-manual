use axum::{
    extract::Json,
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::trace::TraceLayer;
use tracing::{error, info};
use utoipa::{OpenApi, ToSchema};
use utoipa_swagger_ui::SwaggerUi;
use tokio::fs::File;
use tokio_rustls::rustls::{Certificate, PrivateKey, ServerConfig};
use tokio_rustls::TlsAcceptor;
use std::sync::Arc;

#[derive(OpenApi)]
#[openapi(
    paths(
        health,
        inference
    ),
    components(
        schemas(InferenceRequest, InferenceResponse, ApiError)
    ),
    tags(
        (name = "deepclaude", description = "DeepClaude API")
    )
)]
struct ApiDoc;

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/health", get(health))
        .route("/inference", post(inference))
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .layer(TraceLayer::new_for_http());

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    info!("Listening on {}", addr);

    let config = load_rustls_config().await.expect("Failed to load TLS config");
    let acceptor = TlsAcceptor::from(Arc::new(config));

    axum_server::bind_rustls(addr, acceptor)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn load_rustls_config() -> Result<ServerConfig, Box<dyn std::error::Error>> {
    let cert = tokio::fs::read("/certs/cert.pem").await?;
    let key = tokio::fs::read("/certs/key.pem").await?;

    let cert = Certificate(cert);
    let key = PrivateKey(key);

    let config = ServerConfig::builder()
        .with_safe_defaults()
        .with_no_client_auth()
        .with_single_cert(vec![cert], key)?;

    Ok(config)
}

#[utoipa::path(
    get,
    path = "/health",
    responses(
        (status = 200, description = "Service is healthy", body = String)
    ),
    tag = "deepclaude"
)]
async fn health() -> &'static str {
    "OK"
}

#[derive(Deserialize, Serialize, ToSchema)]
struct InferenceRequest {
    messages: Vec<Message>,
    stream: Option<bool>,
    verbose: Option<bool>,
}

#[derive(Deserialize, Serialize, ToSchema)]
struct Message {
    role: String,
    content: String,
}

#[derive(Serialize, ToSchema)]
struct InferenceResponse {
    content: String,
}

#[utoipa::path(
    post,
    path = "/inference",
    request_body = InferenceRequest,
    responses(
        (status = 200, description = "Successful inference", body = InferenceResponse),
        (status = 400, description = "Bad request", body = ApiError),
        (status = 500, description = "Internal server error", body = ApiError)
    ),
    tag = "deepclaude"
)]
async fn inference(Json(payload): Json<InferenceRequest>) -> Result<Json<InferenceResponse>, ApiError> {
    // TODO: Implement actual inference logic
    info!("Received inference request: {:?}", payload);
    
    // Simulate inference
    let response = InferenceResponse {
        content: "This is a simulated response from DeepClaude.".to_string(),
    };
    
    Ok(Json(response))
}

#[derive(thiserror::Error, Debug)]
enum ApiError {
    #[error("Bad request: {0}")]
    BadRequest(String),
    #[error("Internal server error")]
    InternalServerError,
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            ApiError::BadRequest(msg) => (StatusCode::BAD_REQUEST, msg),
            ApiError::InternalServerError => (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error".to_string()),
        };

        let body = Json(serde_json::json!({
            "error": error_message,
        }));

        (status, body).into_response()
    }
}

#[derive(Serialize, ToSchema)]
struct ApiErrorResponse {
    error: String,
}

