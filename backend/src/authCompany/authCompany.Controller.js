import { loginCompany, registerCompany } from "./authCompanyService.js";

export const companyRegister = async (req, res) => {
  try {
    const { name, nit, email, password, address, phone } = req.body;

    const company = await registerCompany({
      name,
      nit,
      email,
      password,
      address,
      phone,
    });
    res.status(200).json(company);
  } catch (error) {
    console.error("Error backend registerAdmin:", error.message);
    res
      .status(400)
      .json({ message: error.message || "Error al registrar la empresa" });
  }
};

export const loginCompanyController = async (req, res) => {
  try {
    const { nit, email, password } = req.body;
    const company = await loginCompany(nit, email, password);
    res.cookie("token", company.token);
    res.status(200).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const logout = async (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.sendStatus(200);
};
