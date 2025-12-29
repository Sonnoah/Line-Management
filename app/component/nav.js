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
                        className="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-1 w-52 p-2 shadow">
                        <li> <Link href="/">Home</Link></li>
                        <li> <Link href="/profile">Profile</Link></li>
                        <li><a>About</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}