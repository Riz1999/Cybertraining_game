import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ComplaintAnalysisModule from '../components/modules/ComplaintAnalysisModule';
import EvidenceCollectionModule from '../components/modules/EvidenceCollectionModule';
import TransactionTracingModule from '../components/modules/TransactionTracingModule';
import LegalCaseBuildingModule from '../components/modules/LegalCaseBuildingModule';
import NotFound from '../components/common/NotFound';

const FinancialFraudInvestigationPage = () => {
  const { level } = useParams();

  const renderContent = () => {
    switch (level) {
      case 'complaint-analysis':
        return <ComplaintAnalysisModule />;
      case 'evidence-collection':
        return <EvidenceCollectionModule />;
      case 'transaction-tracing':
        return <TransactionTracingModule />;
      case 'legal-case-building':
        return <LegalCaseBuildingModule />;
      // Additional levels will be added here as they are implemented
      default:
        return <NotFound message="Level not found" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </Layout>
  );
};

export default FinancialFraudInvestigationPage;