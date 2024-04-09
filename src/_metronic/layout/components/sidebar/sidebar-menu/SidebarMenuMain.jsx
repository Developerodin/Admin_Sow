import { useIntl } from "react-intl";
import { SidebarMenuItem } from "./SidebarMenuItem";
import PeopleIcon from "@mui/icons-material/People";
import WidgetsIcon from "@mui/icons-material/Widgets";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CategoryIcon from "@mui/icons-material/Category";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PaymentsIcon from "@mui/icons-material/Payments";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
const SidebarMenuMain = () => {
  // const {userPermisson}=useContext(UserContext);
  const userPermisson = JSON.parse(sessionStorage.getItem("userPermisson"));
  const intl = useIntl();

  return (
    <>
      <SidebarMenuItem
        to="/dashboard"
        icon={<WidgetsIcon style={{ color: "orange", fontSize: "25px" }} />}
        title={intl.formatMessage({ id: "MENU.DASHBOARD" })}
        fontIcon="bi-app-indicator"
      />

      <SidebarMenuItem
        to="/vendors"
        icon={<PeopleIcon style={{ color: "orange", fontSize: "25px" }} />}
        title="Vendors"
        fontIcon="bi-layers"
      />

      <SidebarMenuItem
        to="/rates"
        icon={<LocalAtmIcon style={{ color: "orange", fontSize: "25px" }} />}
        title="Rates"
        fontIcon="bi-layers"
      />

      <SidebarMenuItem
        to="/orders"
        icon={
          <ShoppingCartIcon style={{ color: "orange", fontSize: "25px" }} />
        }
        title="Orders"
        fontIcon="bi-layers"
      />

<SidebarMenuItem
        to="/b2b_orders"
        icon={
          <ShoppingCartIcon style={{ color: "orange", fontSize: "25px" }} />
        }
        title="Vendors Orders"
        fontIcon="bi-layers"
      />

      <SidebarMenuItem
        to="/categories"
        icon={<CategoryIcon style={{ color: "orange", fontSize: "25px" }} />}
        title="Categories"
        fontIcon="bi-layers"
      />

      <SidebarMenuItem
        to="/sales"
        icon={
          <MonetizationOnIcon style={{ color: "orange", fontSize: "25px" }} />
        }
        title="Sales"
        fontIcon="bi-layers"
      />

      <SidebarMenuItem
        to="/plans"
        icon={<PaymentsIcon style={{ color: "orange", fontSize: "25px" }} />}
        title="Plans"
        fontIcon="bi-layers"
      />

      <SidebarMenuItem
        to="/accounts"
        icon={
          <ManageAccountsIcon style={{ color: "orange", fontSize: "25px" }} />
        }
        title="Accounts"
        fontIcon="bi-layers"
      />

      <SidebarMenuItem
        to="/users"
        icon={
          <AccountCircleIcon style={{ color: "orange", fontSize: "25px" }} />
        }
        title="User"
        fontIcon="bi-layers"
      />
    </>
  );
};

export { SidebarMenuMain };
