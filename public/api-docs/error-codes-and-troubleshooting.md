# Error Codes and Troubleshooting

This document provides information about error codes you may encounter when using the Beluga API and offers troubleshooting tips.

## Common Error Codes

### 400 Bad Request

This error occurs when the request is malformed or missing required parameters.

Possible causes:
- Missing required fields in the request body
- Invalid data types for fields
- Query parameters are missing or incorrect

Troubleshooting:
1. Check that all required fields are included in your request.
2. Ensure that the data types of all fields match the API specification.
3. Verify that query parameters are correctly formatted and included.

### 401 Unauthorized

This error occurs when authentication fails or the user doesn't have permission to access the requested resource.

Possible causes:
- Missing or invalid API key
- Expired authentication token
- Insufficient permissions for the requested operation

Troubleshooting:
1. Check that you're including a valid API key in the request headers.
2. Ensure that your authentication token hasn't expired.
3. Verify that your account has the necessary permissions for the requested operation.

### 404 Not Found

This error occurs when the requested resource doesn't exist.

Possible causes:
- Incorrect API endpoint URL
- Resource (e.g., research query) with the specified ID doesn't exist

Troubleshooting:
1. Double-check the API endpoint URL to ensure it's correct.
2. Verify that the resource ID you're trying to access exists and is correct.

### 500 Internal Server Error

This error occurs when an unexpected condition was encountered on the server.

Possible causes:
- Server-side issues or bugs
- Temporary service disruptions

Troubleshooting:
1. Retry the request after a short delay.
2. If the error persists, contact Beluga support for assistance.

## Troubleshooting Tips

1. **Check your request format**: Ensure that your requests are properly formatted according to the API documentation.

2. **Validate your API key**: Make sure you're using a valid API key and that it's included in the correct header.

3. **Review rate limits**: Check if you've exceeded any rate limits for API calls.

4. **Monitor response headers**: Look for any informative headers in the API response that might provide additional context about errors.

5. **Use proper error handling**: Implement robust error handling in your code to gracefully manage API errors.

6. **Check for service status**: Visit the Beluga status page to see if there are any ongoing service disruptions.

7. **Consult the documentation**: Refer to the API documentation for specific endpoint requirements and expected responses.

If you continue to experience issues after trying these troubleshooting steps, please contact Beluga support for further assistance.

