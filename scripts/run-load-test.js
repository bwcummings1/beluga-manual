const { exec } = require("child_process")
const fs = require("fs")
const path = require("path")

const outputDir = path.join(__dirname, "..", "load-test-results")

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

const timestamp = new Date().toISOString().replace(/:/g, "-")
const outputFile = path.join(outputDir, `load-test-report-${timestamp}.json`)

console.log("Starting load test...")

exec(`npx artillery run artillery.yml -o ${outputFile}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`)
    return
  }
  console.log(`Load test completed. Results saved to ${outputFile}`)
  console.log("Generating HTML report...")

  const htmlOutputFile = path.join(outputDir, `load-test-report-${timestamp}.html`)
  exec(`npx artillery report ${outputFile} -o ${htmlOutputFile}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error generating HTML report: ${error.message}`)
      return
    }
    console.log(`HTML report generated: ${htmlOutputFile}`)
  })
})

