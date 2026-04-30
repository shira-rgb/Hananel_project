import { useParams } from "react-router-dom";
import { ContactEdit } from "../../../components/ContactEdit";

export const DentalLeadEdit = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return <ContactEdit business="dental" kind="leads" id={id} />;
};
