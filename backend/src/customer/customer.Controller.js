
import { deleteCustomer, getaCustomer, getAllCustomer, updateCustomerById } from "./customerService.js";




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


export const updateCustomerController = async (req, res) => {
  try {
    const idAdmin = req.user.id;
    const customerId = req.params.id;

    const updatedCustomer = await updateCustomerById(idAdmin, customerId, req.body);

    if (updatedCustomer.error) {
      return res.status(400).json({ error: updatedCustomer.error });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
