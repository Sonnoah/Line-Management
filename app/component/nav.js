import Link from 'next/link'

export default function Nav() {
    return (
        <div className="navbar fixed top-0 left-0 w-full z-50">
            <div className="navbar-end w-full">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost ">
                        <span className="solar--menu-dots-square-broken"></span>
                    </div>
                     <ul
                        tabIndex="-1"
                        className="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-1 w-52 p-2 shadow text-[16px]">
                        <li> <Link href="/"><span className="iconamoon--home"></span> Home</Link></li>
                        <li> <Link href="/profile"><span className="ri--user-5-line"></span>Profile</Link></li>
                        <li>
                            <a className="pointer-events-none opacity-50"><span className="oui--nav-reports"></span>Request</a>
                            <ul>
                            <li><a>Submenu 1</a></li>
                            <li> <Link href="/request_for_leave">Request For Leave</Link></li>
                            </ul>
                        </li>
                        <li> <Link href="/admit">Admit Panel</Link></li>
                        </ul>
                </div>
            </div>
        </div>
    );
}