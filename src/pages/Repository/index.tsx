import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useRouteMatch, Link } from 'react-router-dom';

import api from '../../services/api';

import { Header, RepositoryInfo, Issues } from './styles';

import logoImg from '../../assets/logo.svg';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const { params } = useRouteMatch<RepositoryParams>();

  useEffect(() => {
    (async () => {
      const [repositoriesResponse, issuesResponse] = await Promise.all([
        api.get<Repository>(`/repos/${ params.repository }`),
        api.get<Issue[]>(`/repos/${ params.repository }/issues`),
      ]);

      setRepository(repositoriesResponse.data);
      setIssues(issuesResponse.data);
    })();
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={ logoImg } alt="Github Explorer" />
        <Link to="/">
          <FiChevronLeft size={ 16 } /> Voltar
        </Link>
      </Header>

      { repository && (
        <RepositoryInfo>
          <header>
            <img src={ repository.owner.avatar_url } alt={ repository.owner.login } />

            <div>
              <strong>{ repository.full_name }</strong>
              <p>{ repository.description }</p>
            </div>
          </header>

          <ul>
            <li>
              <strong>{ repository.stargazers_count }</strong>
              <p>Stars</p>
            </li>
            <li>
              <strong>{ repository.forks_count }</strong>
              <p>Forks</p>
            </li>
            <li>
              <strong>{ repository.open_issues_count }</strong>
              <p>Issues abertas</p>
            </li>
          </ul>
        </RepositoryInfo>
      ) }

      <Issues>
        { issues.map((issue) => (
          <a href={ issue.html_url } key={ issue.id } target="_blank" rel="noopener noreferrer">
            <div>
              <strong>{ issue.title }</strong>
              <p>{ issue.user.login }</p>
            </div>

            <FiChevronRight size={ 20 } />
          </a>
        )) }
      </Issues>
    </>
  );
};

export default Repository;
