const ProductionSheet = require('../models/productionSheetModel');

async function saveProductionSheetController(req, res) {
    try {
        const { projectId, sheetData, doorPanel, additionalMaterial } = req.body;

        let productionSheet = await ProductionSheet.findOne({ projectId });

        if (productionSheet) {
            // Update existing sheet
            productionSheet.sheetData = {
                ...productionSheet.sheetData,
                ...sheetData
            };
            productionSheet.doorPanel = doorPanel;
            productionSheet.additionalMaterial = additionalMaterial;
        } else {
            // Create new sheet
            productionSheet = new ProductionSheet({
                projectId,
                sheetData,
                doorPanel,
                additionalMaterial
            });
        }

        await productionSheet.save();

        res.status(200).json({
            message: 'Production sheet saved successfully',
            data: productionSheet,
            success: true,
            error: false
        });
    } catch (err) {
        console.error('Error saving production sheet:', err);
        res.status(500).json({
            message: err.message || 'Server Error',
            error: true,
            success: false
        });
    }
}

async function getProductionSheetController(req, res) {
    try {
        const { projectId } = req.params;

        const productionSheet = await ProductionSheet.findOne({ projectId });

        if (!productionSheet) {
            return res.status(404).json({
                message: 'Production sheet not found',
                error: true,
                success: false
            });
        }

        res.status(200).json({
            message: 'Production sheet fetched successfully',
            data: productionSheet,
            success: true,
            error: false
        });
    } catch (err) {
        console.error('Error fetching production sheet:', err);
        res.status(500).json({
            message: err.message || 'Server Error',
            error: true,
            success: false
        });
    }
}

module.exports = {
    saveProductionSheetController,
    getProductionSheetController
};