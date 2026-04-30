import { useParams } from "react-router-dom";
import { ContactEdit } from "../../../components/ContactEdit";

export const AestheticLeadEdit = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <ContactEdit business="aesthetic" kind="leads" id={id} />;
};
