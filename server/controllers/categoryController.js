const categoryService = require('../services/categoryService');

class CategoryController {
  async getAll(req, res) {
    try {
      const categories = categoryService.getAll();
      
      res.json({
        success: true,
        count: categories.length,
        data: categories
      });
    } catch (error) {
      console.error('Error getting categories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve categories'
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const category = categoryService.getById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Error getting category:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve category'
      });
    }
  }
}

module.exports = new CategoryController();
