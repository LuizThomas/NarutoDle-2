import { Router } from 'express';
import { 
  handleSearchCharacters, 
  handleGetAllCharacters, 
  handleGetCharacterById, 
  handleAdminValidateCharacters, 
  handleAdminAddOrUpdateCharacter 
} from '../controllers/characterController.js';
import { 
  handleCreateGame, 
  handleGetGame, 
  handleMakeGuess, 
  handleSurrenderGame, 
  handleGetStats, 
  handleGetLeaderboard 
} from '../controllers/gameController.js';

const router = Router();

// Character endpoints
router.get('/characters/search', handleSearchCharacters);
router.get('/characters', handleGetAllCharacters);
router.get('/characters/:id', handleGetCharacterById);

// Game engine endpoints
router.post('/games', handleCreateGame);
router.get('/games/:id', handleGetGame);
router.post('/games/:id/guess', handleMakeGuess);
router.post('/games/:id/finish', handleSurrenderGame);

// Stats & Leaderboard
router.get('/stats', handleGetStats);
router.get('/leaderboard', handleGetLeaderboard);

// Admin & Databook management
router.get('/admin/validate', handleAdminValidateCharacters);
router.post('/admin/characters', handleAdminAddOrUpdateCharacter);

export default router;
