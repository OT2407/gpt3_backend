const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const WORKSPACE_ROOT = path.join(__dirname, '../workspace')
const BASE_TEMPLATE_PATH = path.join(WORKSPACE_ROOT, 'base-template')

function generateProjectId() {
  const timestamp = Date.now()
  return `project-${timestamp}`
}

function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true })
  }

  const files = fs.readdirSync(source)

  for (const file of files) {
    if (file === '.git') continue // never copy git history

    const currentSource = path.join(source, file)
    const currentTarget = path.join(target, file)

    if (fs.lstatSync(currentSource).isDirectory()) {
      copyFolderRecursiveSync(currentSource, currentTarget)
    } else {
      fs.copyFileSync(currentSource, currentTarget)
    }
  }
}

function createProject() {
  if (!fs.existsSync(BASE_TEMPLATE_PATH)) {
    throw new Error('Base template not found')
  }

  const projectId = generateProjectId()
  const projectPath = path.join(WORKSPACE_ROOT, projectId)

  copyFolderRecursiveSync(BASE_TEMPLATE_PATH, projectPath)

  // initialize git inside new project
  execSync('git init', { cwd: projectPath })
  execSync('git add .', { cwd: projectPath })
  execSync('git commit -m "Initial project clone from base template"', { cwd: projectPath })

  return {
    projectId,
    projectPath
  }
}

module.exports = {
  createProject
}
const { createProject } = require('./services/workspaceManager')

const result = createProject()
console.log(result)
