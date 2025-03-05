const axios = require('axios');

class MarketService {
    async buyFromMarket(ingredient) {
        try {
            console.log("me toco ir a la plaza ome a compar: ",ingredient )
            const response = await axios.get(`https://recruitment.alegra.com/api/farmers-market/buy?ingredient=${ingredient}`);
            return response.data.quantitySold || 0;
        } catch (error) {
            console.error(`Market purchase error for ${ingredient}`);
            return 0;
        }
    }
}

module.exports = { MarketService };
