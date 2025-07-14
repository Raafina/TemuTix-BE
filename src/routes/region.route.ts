import express from 'express';
import regionController from '../controllers/region.controller';

const router = express.Router();

router.get("", regionController.getAllProvinces
    /*
     #swagger.tags = ['Regions']
     */
);
router.get("/:id/province", regionController.getProvince
    /*
     #swagger.tags = ['Regions']
     */
);
router.get("/:id/regency", regionController.getRegency
    /*
    #swagger.tags = ['Regions']
    */
);
router.get("/:id/district", regionController.getDistrict
    /*
    #swagger.tags = ['Regions']
    */
);
router.get("/:id/village", regionController.getVillage
    /*
    #swagger.tags = ['Regions']
    */
);
router.get("/search", regionController.findByCity
    /*
    #swagger.tags = ['Regions']
    */
);

export default router;