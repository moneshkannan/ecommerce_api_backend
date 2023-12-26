const getModelName = (model) => {
    const DB_Model = model
    const DB_Model_instance = new DB_Model(); 
    const modelName = DB_Model_instance.constructor.modelName;
    return modelName    
}

module.exports = {getModelName}