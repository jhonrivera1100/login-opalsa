const casinoSchema = mongoose.casinoSchema({
    nombreCasino: {
        type: String,
        required: true,
        trim: true
    },
    imgCasino: {
        type: String,
        required: true,
        trim: true
    },
    ciudadCasino: {
        type: String,
        required: true,
        trim: true
    },
    direccionCasino: {
        type: String,
        required: true,
        trim: true
    },
    documentacionCasino: {
        type: String,
        required: true,
        trim: true
    }
},{
    timestamps:true
})

export default mongoose.model('casinos', casinoSchema)