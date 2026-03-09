const mongoose = require('mongoose');
const Listing = require('../models/listing');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/wanderlust';

const imagesPool = [
    'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618140052121-39fc6db33972?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1602088113235-229c19758e9f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1533619239233-6280475a633a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1602391833977-358a52198938?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?auto=format&fit=crop&w=1200&q=80',
    'https://plus.unsplash.com/premium_photo-1670963964797-942df1804579?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1470165301023-58dab8118cc9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1585543805890-6051f7829f98?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505691723518-36a5a3a3d9b0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1468276311594-df7cb65d8df6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505692794406-1d8d1d5b6f4a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1200&q=80'
];

async function run() {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB:', MONGO_URL);
    const listings = await Listing.find({}).sort({ _id: 1 }).exec();
    if (!listings || listings.length === 0) {
        console.log('No listings found to update.');
        await mongoose.connection.close();
        return;
    }

    for (let i = 0; i < listings.length; i++) {
        const l = listings[i];
        const img = imagesPool[i % imagesPool.length];
        // assign single primary image and set images array with this and next two picks for variety
        const imgs = [img];
        const next1 = imagesPool[(i + 1) % imagesPool.length];
        const next2 = imagesPool[(i + 2) % imagesPool.length];
        if (next1 && next1 !== img) imgs.push(next1);
        if (next2 && next2 !== img && next2 !== next1) imgs.push(next2);
        l.image = imgs[0];
        l.images = imgs;
        await l.save();
        console.log(`Updated listing ${l._id} -> ${imgs[0]}`);
    }

    console.log(`Updated ${listings.length} listings.`);
    await mongoose.connection.close();
}

run().catch((err) => {
    console.error('Error:', err);
    mongoose.connection.close();
    process.exit(1);
});
