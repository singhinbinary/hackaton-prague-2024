import { useState } from 'react';
import ProfilesList from '../ProfilesList/ProfilesList';

export default function LeftColumn() {
  return (
    <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
      <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
        Instructions
      </h1>

      <p className="leading-relaxed mb-3">
        Click on the right button. This will load neo4j data and display a graph
      </p>

      <ProfilesList />
    </div>
  );
}
