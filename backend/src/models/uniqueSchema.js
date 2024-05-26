const uniqueSchema = new mongoose.Schema({
    name: String,
    phone: String
});

const Unique = mongoose.model('Unique', uniqueSchema);