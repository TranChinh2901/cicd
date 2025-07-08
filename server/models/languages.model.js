const { default: mongoose } = require("mongoose");

const languagesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        categoryLanguages: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CategoryLanguages",
            required: true,
        },
        brandLanguages: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BrandLanguages",
            required: true,
        }
    },
    {
        timestamps: true,
    }
)

languagesSchema.pre('save', function(next) {
    if (this.name) {
        this.name = this.name.trim()
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    if (this.name && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
            .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
            .replace(/[ìíịỉĩ]/g, 'i')
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
            .replace(/[ùúụủũưừứựửữ]/g, 'u')
            .replace(/[ỳýỵỷỹ]/g, 'y')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
    if (this.description) {
        this.description = this.description.trim();
        this.description = this.description.charAt(0).toUpperCase() + this.description.slice(1);
    }

    next();
});

module.exports = mongoose.model('Languages', languagesSchema);