const getModelName = (model) => {
    return model.match(/Model\s*{\s*([a-zA-Z0-9_$]+)/)[1];
}

module.exports = {getModelName}