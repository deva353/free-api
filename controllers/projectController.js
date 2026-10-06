const Project = require("../models/Project");
const User = require("../models/User");

// Create a project
const createProject = async (req, res) => {
    try {
        const {
            title,
            description,
            budget,
            skillsRequired,
            client
        } = req.body;

        // Check required fields
        if (
            !title ||
            !description ||
            budget == null ||
            !client
        ) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        // Check whether client exists
        const existingClient = await User.findById(client);

        if (!existingClient) {
            return res.status(404).json({
                message: "Client not found"
            });
        }

        // Check whether user is actually a client
        if (existingClient.role !== "client") {
            return res.status(400).json({
                message: "Only clients can create projects"
            });
        }

        // Create project
        const project = await Project.create({
            title,
            description,
            budget,
            skillsRequired,
            client
        });

        res.status(201).json({
            message: "Project created successfully",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create project",
            error: error.message
        });
    }
};


// Get all projects
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("client", "name email");

        res.status(200).json(projects);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get projects",
            error: error.message
        });
    }
};


// Get one project
const getProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("client", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json(project);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get project",
            error: error.message
        });
    }
};


// Update project
const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message: "Project updated successfully",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update project",
            error: error.message
        });
    }
};


// Delete project
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(
            req.params.id
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message: "Project deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete project",
            error: error.message
        });
    }
};


module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject
};