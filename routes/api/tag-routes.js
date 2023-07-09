const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    // Find all tags and include associated Product data
    const tags = await Tag.findAll({
      include: {
        model: Product,
        through: ProductTag,
        as: 'products',
      },
    });

    return res.status(200).json(tags);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  const tagId = req.params.id;

  try {
    // Find a single tag by its ID and include associated Product data
    const tag = await Tag.findByPk(tagId, {
      include: {
        model: Product,
        through: ProductTag,
        as: 'products',
      },
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    return res.status(200).json(tag);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const { tag_name } = req.body;

  try {
    // Create a new tag
    const newTag = await Tag.create({ tag_name });

    return res.status(201).json(newTag);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  const tagId = req.params.id;
  const { tag_name } = req.body;

  try {
    // Update a tag's name by its ID
    const updatedTag = await Tag.update({ tag_name }, {
      where: { id: tagId },
    });

    if (updatedTag[0] === 0) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    return res.status(200).json({ message: 'Tag updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const tagId = req.params.id;

  try {
    // Delete a tag by its ID
    const deletedTag = await Tag.destroy({
      where: { id: tagId },
    });

    if (!deletedTag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    return res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
