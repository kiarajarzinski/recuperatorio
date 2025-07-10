import { Character } from '../models/character.model.js';

// Validaciones auxiliares
function isInteger(value) {
  return Number.isInteger(value);
}

function validateCharacterInput(data, isEdit = false) {
  const errors = [];
  const { name, ki, race, gender, description } = data;

  if (!isEdit || name !== undefined) {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.push('El campo name es obligatorio y no puede estar vacío.');
    }
  }
  if (!isEdit || ki !== undefined) {
    if (ki === undefined || ki === null || !isInteger(ki)) {
      errors.push('El campo ki es obligatorio y debe ser un número entero.');
    }
  }
  if (!isEdit || race !== undefined) {
    if (!race || typeof race !== 'string' || race.trim() === '') {
      errors.push('El campo race es obligatorio y no puede estar vacío.');
    }
  }
  if (!isEdit || gender !== undefined) {
    if (!gender || (gender !== 'Male' && gender !== 'Female')) {
      errors.push('El campo gender solo puede ser "Male" o "Female".');
    }
  }
  if (description !== undefined && typeof description !== 'string') {
    errors.push('El campo description debe ser una cadena de texto.');
  }
  return errors;
}

// GET /api/characters
export async function getAllCharacters(req, res) {
  try {
    const characters = await Character.findAll();
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los personajes.' });
  }
}

// GET /api/characters/:id
export async function getCharacterById(req, res) {
  try {
    const character = await Character.findByPk(req.params.id);
    if (!character) {
      return res.status(404).json({ error: 'Personaje no encontrado.' });
    }
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el personaje.' });
  }
}

// POST /api/characters
export async function createCharacter(req, res) {
  const { name, ki, race, gender, description } = req.body;
  const errors = validateCharacterInput({ name, ki, race, gender, description });
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(' ') });
  }
  try {
    // Verificar unicidad de name
    const existing = await Character.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ error: 'Ya existe un personaje con ese nombre.' });
    }
    const character = await Character.create({ name, ki, race, gender, description });
    res.status(201).json(character);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el personaje.' });
  }
}

// PUT /api/characters/:id
export async function updateCharacter(req, res) {
  const { id } = req.params;
  const { name, ki, race, gender, description } = req.body;
  try {
    const character = await Character.findByPk(id);
    if (!character) {
      return res.status(404).json({ error: 'Personaje no encontrado.' });
    }
    const errors = validateCharacterInput({ name, ki, race, gender, description }, true);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(' ') });
    }
    // Verificar unicidad de name si se cambia
    if (name && name !== character.name) {
      const existing = await Character.findOne({ where: { name } });
      if (existing) {
        return res.status(400).json({ error: 'Ya existe un personaje con ese nombre.' });
      }
    }
    await character.update({ name, ki, race, gender, description });
    res.json(character);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el personaje.' });
  }
}

// DELETE /api/characters/:id
export async function deleteCharacter(req, res) {
  const { id } = req.params;
  try {
    const character = await Character.findByPk(id);
    if (!character) {
      return res.status(404).json({ error: 'Personaje no encontrado.' });
    }
    await character.destroy();
    res.json({ message: 'Personaje eliminado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el personaje.' });
  }
}
