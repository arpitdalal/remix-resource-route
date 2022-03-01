import { Outlet } from 'remix';

const IndexLayout = () => {
  return (
    <>
      <header>
        Header
        <ul>
          <li>
            <a href="/">Index w/ layout route</a>
          </li>
          <li>
            <a href="/bar">Bar w/o layout route</a>
          </li>
        </ul>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default IndexLayout;
