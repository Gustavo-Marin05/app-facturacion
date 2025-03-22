import { updateCustomerById } from './customerService.js';

export const updateCustomer = async (req, res) => {
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
