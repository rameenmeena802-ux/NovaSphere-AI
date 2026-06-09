const Project = require('../models/Project');
const mockStore = require('../config/mockDb');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const isFeatured = req.query.featured;
    
    if (global.dbConnected) {
      let query = {};
      if (isFeatured !== undefined) {
        query.featured = isFeatured === 'true';
      }
      const projects = await Project.find(query).sort({ createdAt: -1 });
      res.json({ success: true, count: projects.length, data: projects });
    } else {
      // Mock db path
      let projects = [...mockStore.projects];
      if (isFeatured !== undefined) {
        const featuredBool = isFeatured === 'true';
        projects = projects.filter(p => p.featured === featuredBool);
      }
      // sort by date desc (mock db objects have Date instances)
      projects.sort((a, b) => b.createdAt - a.createdAt);
      res.json({ success: true, count: projects.length, data: projects });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    if (global.dbConnected) {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      res.json({ success: true, data: project });
    } else {
      const project = mockStore.projects.find(p => p._id === req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      res.json({ success: true, data: project });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  const { title, category, description, techStack, mediaUrl, clientLink, githubLink, featured } = req.body;

  if (!title || !category || !description) {
    return res.status(400).json({ success: false, message: 'Please provide title, category and description' });
  }

  try {
    let projectData = {
      title,
      category,
      description,
      techStack: Array.isArray(techStack) ? techStack : techStack ? techStack.split(',').map(s => s.trim()) : [],
      mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      clientLink,
      githubLink,
      featured: featured === true || featured === 'true',
    };

    let newProject;

    if (global.dbConnected) {
      newProject = await Project.create(projectData);
    } else {
      newProject = {
        _id: 'mock_project_' + Date.now(),
        ...projectData,
        createdAt: new Date(),
      };
      mockStore.projects.push(newProject);
    }

    // Broadcast system notification
    if (global.io) {
      global.io.emit('notification', {
        type: 'system',
        title: 'Project Initiated',
        message: `New research project "${title}" added to portfolio list.`,
        createdAt: new Date()
      });
    }

    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const { title, category, description, techStack, mediaUrl, clientLink, githubLink, featured } = req.body;

    if (global.dbConnected) {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      project.title = title || project.title;
      project.category = category || project.category;
      project.description = description || project.description;
      if (techStack !== undefined) {
        project.techStack = Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim());
      }
      project.mediaUrl = mediaUrl || project.mediaUrl;
      project.clientLink = clientLink !== undefined ? clientLink : project.clientLink;
      project.githubLink = githubLink !== undefined ? githubLink : project.githubLink;
      if (featured !== undefined) {
        project.featured = featured === true || featured === 'true';
      }

      const updatedProject = await project.save();
      res.json({ success: true, data: updatedProject });
    } else {
      const index = mockStore.projects.findIndex(p => p._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      const current = mockStore.projects[index];
      const updated = {
        ...current,
        title: title || current.title,
        category: category || current.category,
        description: description || current.description,
        techStack: techStack !== undefined ? (Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim())) : current.techStack,
        mediaUrl: mediaUrl || current.mediaUrl,
        clientLink: clientLink !== undefined ? clientLink : current.clientLink,
        githubLink: githubLink !== undefined ? githubLink : current.githubLink,
        featured: featured !== undefined ? (featured === true || featured === 'true') : current.featured,
      };

      mockStore.projects[index] = updated;
      res.json({ success: true, data: updated });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    if (global.dbConnected) {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      await project.deleteOne();
      res.json({ success: true, message: 'Project removed' });
    } else {
      const index = mockStore.projects.findIndex(p => p._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      mockStore.projects.splice(index, 1);
      res.json({ success: true, message: 'Project removed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
