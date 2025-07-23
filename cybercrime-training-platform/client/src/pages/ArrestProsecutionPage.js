import React from 'react';
import Layout from '../components/layout/Layout';
import ArrestProsecutionModule from '../components/modules/ArrestProsecutionModule';

/**
 * Arrest and Prosecution Page
 * 
 * This page hosts the Level 5 (Arrest and Prosecution) activities for the
 * Financial Fraud Investigation module.
 */
const ArrestProsecutionPage = () => {
  return (
    <Layout>
      <ArrestProsecutionModule />
    </Layout>
  );
};

export default ArrestProsecutionPage;