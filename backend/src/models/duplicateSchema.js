const duplicateSchema = new mongoose.Schema({
    name: String,
    phone: String
});

const Duplicate = mongoose.model('Duplicate', duplicateSchema);