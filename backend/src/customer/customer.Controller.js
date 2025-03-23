import { deleteCustomer, getaCustomer, getAllCustomer } from "./customerService.js";




//obtener todos los clientes
export const getAllCustomerController = async (req, res) => {
  try {
    const customer = await getAllCustomer(req.user.id);
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json("error en getallcustomer");
  }
};

//obtener solo un cliente
export const getaCustomerController = async(req,res)=>{
    try {
        const customer =await getaCustomer(req.params.id,req.user.id);
        res.status(200).json(customer)
        
    } catch (error) {
        res.status(400).json('error en getacustomer')
    }
}


//borrar al cliente

export const deleteCustomerController =async (req,res)=>{

    try {
        
        const customer = await deleteCustomer(req.params.id,req.user.id);
        res.status(200).json(customer);
    } catch (error) {
        res.status(400).json('error en deletecustomer')
    }
}
