import { Router } from 'express';

const router = Router();

// User endpoints
router.post('/users', async (req, res) => {
  try {
    const { userId, username } = req.body;
    
    // In production, validate authentication here
    if (!userId || !username) {
      return res.status(400).json({ error: 'userId and username are required' });
    }

    // For this prototype, we'll use Firebase client-side
    // In production, use Firebase Admin SDK server-side
    res.json({ success: true, message: 'Use Firebase client-side for this prototype' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // For this prototype, return demo data
    // In production, fetch from Firebase
    const demoUser = {
      userId,
      username: 'Alex Kumar',
      level: 3,
      totalXp: 1250,
      streak: 12,
      badges: 8,
      completedTreasures: ['solar-power', 'wind-energy', 'organic-farming'],
    };
    
    res.json(demoUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Mission progress endpoints
router.post('/mission-progress', async (req, res) => {
  try {
    const { userId, treasureId, score, xpEarned } = req.body;
    
    if (!userId || !treasureId) {
      return res.status(400).json({ error: 'userId and treasureId are required' });
    }

    // For prototype, just acknowledge the request
    // In production, save to Firebase Admin SDK
    console.log('Mission completed:', { userId, treasureId, score, xpEarned });
    
    res.json({ 
      success: true, 
      message: 'Mission progress saved',
      xpEarned: xpEarned || 500
    });
  } catch (error) {
    console.error('Error saving mission progress:', error);
    res.status(500).json({ error: 'Failed to save mission progress' });
  }
});

router.get('/mission-progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Return demo mission data
    const demoMissions = [
      {
        userId,
        treasureId: 'water-cycle',
        completedClues: ['🌊'],
        score: null,
        completedAt: null
      }
    ];
    
    res.json(demoMissions);
  } catch (error) {
    console.error('Error fetching mission progress:', error);
    res.status(500).json({ error: 'Failed to fetch mission progress' });
  }
});

// Sync endpoint for offline data
router.post('/sync', async (req, res) => {
  try {
    const pendingData = req.body;
    
    console.log('Syncing offline data:', pendingData);
    
    // In production, process the offline sync data
    // For now, just acknowledge
    res.json({ 
      success: true, 
      message: 'Offline data synced successfully',
      synced: pendingData.length || 1
    });
  } catch (error) {
    console.error('Error syncing data:', error);
    res.status(500).json({ error: 'Failed to sync data' });
  }
});

export default router;