import Link from "next/link";

export default function Nav() {
  return (
    <div className="navbar fixed top-0 left-0 w-full z-50">
      <div className="navbar-end w-full">

        <div className="dropdown dropdown-end">
           <div tabIndex={0} role="button" className="btn btn-circle btn-ghost group relative flex items-center justify-center">
             <span className="absolute heroicons-solid--menu-alt-3 text-2xl transition-all duration-300 ease-in-out opacity-100 scale-100 rotate-0 group-focus:opacity-0 group-focus:scale-100  group-focus:rotate-90"></span>
             <span className="absolute line-md--menu-to-close-alt-transition text-2xl transition-all duration-300 ease-in-out opacity-0 scale-75 rotate--90 group-focus:opacity-100 group-focus:scale-100   group-focus:rotate-0"></span>
          </div> 
          <ul tabIndex={-1} className="menu menu-md dropdown-content bg-base-100 rounded-box mt-0 w-52 p-2 shadow">
            <li><Link href="/"><span className="iconamoon--home"></span> Home</Link></li> 
            <li><Link href="/profile"><span className="ri--user-5-line"></span>Profile</Link></li>
            <li><a className="pointer-events-none opacity-50">
              <span className="oui--nav-reports"></span>Request</a> 
                <ul>
                  <li><a>Submenu 1</a></li> 
                  <li><Link href="/request_for_leave">Request For Leave</Link></li> 
                </ul> 
              </li> 
            <li><Link href="/admit"><span className="qlementine-icons--id-card-16"></span>Admit Panel</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
