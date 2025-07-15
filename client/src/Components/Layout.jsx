import Gallery from "./Gallery"

function Layout( {children} ) {

    return (
        <div className="page-content">
            <h1>sanjay kumar photography</h1>
            <main>{children}</main>
        </div>

    )

}
export default Layout