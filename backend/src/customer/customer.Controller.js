import {
  createCustomer,
  deleteCustomer,
  findCustomerByCiAndUserId,
  getaCustomer,
  getAllCustomer,
  updateCustomerById,
} from "./customerService.js";

// Crear un cliente
export const createCustomerController = async (req, res) => {
  try {
    const newCustomer = await createCustomer(req.user.idAdmin, req.body); // req.user.id viene del token
    res.status(200).json(newCustomer);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el cliente" });
  }
};

//obtener todos los clientes
export const getAllCustomerController = async (req, res) => {
  try {
    const adminId = req.user.id;
    const customers = await getAllCustomer(adminId); // ✅ aquí sí lo pasamos
    res.status(200).json(customers);
  } catch (error) {
    res.status(400).json({ message: "Error en getAllCustomer", error });
  }
};

//obtener solo un cliente
export const getaCustomerController = async (req, res) => {
  try {
    const customer = await getaCustomer(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error("Error en getacustomer:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


//borrar al cliente

export const deleteCustomerController = async (req, res) => {
  try {
    const customer = await deleteCustomer(req.params.id, req.user.id);
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json("error en deletecustomer");
  }
};

export const updateCustomerController = async (req, res) => {
  try {
    const idAdmin = req.user.id;
    const customerId = req.params.id;

    const updatedCustomer = await updateCustomerById(
      idAdmin,
      customerId,
      req.body
    );

    if (updatedCustomer.error) {
      return res.status(400).json({ error: updatedCustomer.error });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getCustomerByCi = async (req, res) => {
  const { ci } = req.params;
  const userId = req.user.id;

  try {
    const customer = await findCustomerByCiAndUserId(ci, userId);

    if (!customer) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.json(customer);
  } catch (error) {
    console.error("Error al buscar cliente por CI:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
