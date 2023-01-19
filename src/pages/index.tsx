import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import Login from "../../components/login";

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <Login/> 
      </Layout>
    </>
  );
};

export default Home;
