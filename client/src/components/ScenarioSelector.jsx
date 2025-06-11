import React, { useState } from 'react';

const ScenarioSelector = ({ scenarios, onSelect, onCancel }) => {
  const [selectedScenario, setSelectedScenario] = useState('');
  const [characterName, setCharacterName] = useState('Commander');
  const [characterRole, setCharacterRole] = useState('Colony Leader');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedScenario && characterName.trim()) {
      onSelect(selectedScenario, {
        name: characterName.trim(),
        role: characterRole.trim()
      });
    }
  };

  const getScenarioDefaults = (scenarioKey) => {
    const defaults = {
      'space-colony': { name: 'Commander', role: 'Colony Leader' },
      'post-apocalyptic': { name: 'Survivor', role: 'Group Leader' },
      'fantasy': { name: 'Adventurer', role: 'Hero' },
      'historical': { name: 'Explorer', role: 'Expedition Leader' },
      'cyberpunk': { name: 'Runner', role: 'Netrunner' }
    };
    return defaults[scenarioKey] || { name: 'Character', role: 'Protagonist' };
  };

  const handleScenarioChange = (scenarioKey) => {
    setSelectedScenario(scenarioKey);
    const defaults = getScenarioDefaults(scenarioKey);
    setCharacterName(defaults.name);
    setCharacterRole(defaults.role);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create New Adventure
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Scenario Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                Choose Your Adventure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.key}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedScenario === scenario.key
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                    onClick={() => handleScenarioChange(scenario.key)}
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {scenario.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {scenario.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Character Customization */}
            {selectedScenario && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Create Your Character
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Character Name
                    </label>
                    <input
                      type="text"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter character name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Role/Title
                    </label>
                    <input
                      type="text"
                      value={characterRole}
                      onChange={(e) => setCharacterRole(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter character role"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedScenario || !characterName.trim()}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                Start Adventure
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSelector;

