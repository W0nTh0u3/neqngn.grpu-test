import { Router, Request, Response } from 'express';
import { getEthInfo } from '../services/eth.service';

const router = Router();

router.get('/:address', async (req: Request, res: Response) => {
    const address = req.params.address;

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        res.status(400).json({ error: 'Invalid Ethereum address' });
        return;
    }

    try {
        const data = await getEthInfo(address);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;