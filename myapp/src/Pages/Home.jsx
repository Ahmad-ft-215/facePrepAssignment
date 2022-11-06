import React, { useState, useEffect, useRef } from "react";
import styles from "../Styles/Home.module.css";
import { nanoid } from "nanoid";
import { Loader } from "../Loader/Loader";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://randomuser.me/api/?page=${page}&results=10`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(prev => {
          return [...new Set([...prev, ...data.results.map(user => user)])]
        });
        setMore(data.results.length > 0);
        setLoading(false);
        setError(false);
      })
      .catch((er) => {
        console.log("error", er);
        setLoading(false);
        setError(true);
      });
  }, [page]);

  const observer = useRef();
  const bottomTipRef = React.useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && more) {
        setPage(prev => prev + 1)
      }
    })
    if (node) observer.current.observe(node);
  }, [loading, more])

  console.log(users);

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/')
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.navdiv}>
          <h1>Scrolling</h1>
          <button className={styles.logoutbtn} onClick={handleLogout}>Logout</button>
        </div>
        <div className={styles.userbody}>
          {users?.map((user) => {
            return (
              <div className={styles.onecard} key={nanoid()} ref={bottomTipRef}>
                <div className={styles.userPicture}>
                  <img src={user.picture.thumbnail} alt={user.id.name} />
                </div>
                <div className={styles.userName}>
                  <span>Name:</span>
                  <p>
                    {user.name.first} {user.name.last}
                  </p>
                </div>
                <div className={styles.userEmail}>
                  <span>Email:</span> <p> {user.email}</p>
                </div>
                <div className={styles.userPhone}>
                  <span>Mobile:</span> <p> {user.phone}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.loader}>{loading && <Loader />}</div>
      <div className={styles.error}>{error && <h1>Error</h1>}</div>
    </>
  );
};