import { LuPopcorn } from "react-icons/lu";
import { GiHealthNormal } from "react-icons/gi";
import { BiSolidDrink } from "react-icons/bi";
import { HiOfficeBuilding } from "react-icons/hi";
import { FaPeopleGroup } from "react-icons/fa6";
import { 
  GiEarthAsiaOceania,
  GiPostOffice 
} from "react-icons/gi";
import { 
  MdHistoryEdu, 
  MdConstruction, 
  MdPets,
  MdLocalAirport,
  MdOutlineSportsBasketball,
  MdEmojiTransportation,
  MdAdminPanelSettings,
  MdOutlineProductionQuantityLimits,
  MdDisabledByDefault
} from "react-icons/md";
import { 
  FaHouseUser, 
  FaRunning, 
  FaShoppingBag,
  FaHamburger,
  FaBook,
  FaChild,
  FaTree,
  FaCar,
  FaMoneyBill,
  FaHandshake,
  FaCameraRetro,
  FaPray,
  FaCampground,
  FaSwimmingPool,
  FaUmbrellaBeach,
  FaKissWinkHeart,
  FaBuilding,
  FaSkiing,
  FaTrash,
  FaRecycle
} from "react-icons/fa";


export default function AttractionCard({category, attraction}) {

  const getCategoryIcon = () => {
    let icon;

    switch (true) {
      case category.includes('accommodation'):
        icon = <FaHouseUser />;
        break;
      case category.includes('activity'):
        icon = <FaRunning />;
        break;
      case category.includes('commercial'):
        icon = <FaShoppingBag />;
        break;
      case category.includes('catering'):
        icon = <FaHamburger />;
        break;
      case category.includes('education'):
        icon = <FaBook />;
        break;
      case category.includes('childcare'):
        icon = <FaChild />;
        break;
      case category.includes('entertainment'):
        icon = <LuPopcorn />;
        break;
      case category.includes('healthcare'):
        icon = <GiHealthNormal />;
        break;
      case category.includes('heritage'):
        icon = <MdHistoryEdu />;
        break;
      case category.includes('leisure'):
        icon = <BiSolidDrink />;
        break;
      case category.includes('man_made'):
        icon = <MdConstruction />;
        break;
      case category.includes('natural'):
        icon = <GiEarthAsiaOceania />;
        break;
      case category.includes('national park'):
        icon = <FaTree />;
        break;
      case category.includes('office'):
        icon = <HiOfficeBuilding />;
        break;
      case category.includes('parking'):
        icon = <FaCar />;
        break;
      case category.includes('pet'):
        icon = <MdPets />;
        break;
      case category.includes('rental'):
        icon = <FaMoneyBill />;
        break;
      case category.includes('service'):
        icon = <FaHandshake />;
        break;
      case category.includes('tourism'):
        icon = <FaCameraRetro />;
        break;
      case category.includes('religion'):
        icon = <FaPray />;
        break;
      case category.includes('camping'):
        icon = <FaCampground />;
        break;
      case category.includes('amenity'):
        icon = <FaSwimmingPool />;
        break;
      case category.includes('beach'):
        icon = <FaUmbrellaBeach />;
        break;
      case category.includes('adult'):
        icon = <FaKissWinkHeart />;
        break;
      case category.includes('airport'):
        icon = <MdLocalAirport />;
        break;
      case category.includes('building'):
        icon = <FaBuilding />;
        break;
      case category.includes('ski'):
        icon = <FaSkiing />;
        break;
      case category.includes('sport'):
        icon = <MdOutlineSportsBasketball />;
        break;
      case category.includes('public transport'):
        icon = <MdEmojiTransportation />;
        break;
      case category.includes('administrative'):
        icon = <MdAdminPanelSettings />;
        break;
      case category.includes('postal code'):
        icon = <GiPostOffice />;
        break;
      case category.includes('political'):
        icon = <FaTrash />;
        break;
      case category.includes('low emission zone'):
        icon = <FaRecycle />;
        break;
      case category.includes('populated place'):
        icon = <FaPeopleGroup />;
        break;
      case category.includes('production'):
        icon = <MdOutlineProductionQuantityLimits />;
        break;
      default:
        icon = <MdDisabledByDefault />;
    }
  
    return (
      <div className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'>
        <div className='text-9xl flex justify-center items-center pt-7'>
          {icon}
        </div>
      </div>
    );
  };


    return (
      <div className='bg-white shadow-md hover:shadow-lg 
      transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
        {getCategoryIcon()}
        <p>
          {attraction.properties.formatted}
        </p>
        <p className='text-2xl font-semibold'>
          {attraction.properties.name}
        </p>
      </div>
    )
  }
  