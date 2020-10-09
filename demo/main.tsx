import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import QueryBuilder, { ExportFormat, Field, formatQuery, RuleGroupType } from '../src';
import '../src/query-builder.scss';

const preparedFields: { [key: string]: Field[] } = {
  primary: [
    { name: 'firstName', label: 'First Name' },
    { name: 'lastName', label: 'Last Name' }
  ],
  secondary: [
    { name: 'age', label: 'Age', inputType: 'number' },
    {
      name: 'isMusician',
      label: 'Is a musician',
      valueEditorType: 'checkbox',
      operators: [{ name: '=', label: 'is' }]
    },
    {
      name: 'instrument',
      label: 'Instrument',
      valueEditorType: 'select',
      values: [
        { name: 'Guitar', label: 'Guitar' },
        { name: 'Piano', label: 'Piano' },
        { name: 'Vocals', label: 'Vocals' },
        { name: 'Drums', label: 'Drums' }
      ],
      operators: [{ name: '=', label: 'is' }]
    }
  ],
  generic: [
    { name: 'firstName', label: 'First name' },
    { name: 'lastName', label: 'Last name' },
    { name: 'age', label: 'Age', inputType: 'number' },
    {
      name: 'gender',
      label: 'Gender',
      valueEditorType: 'radio',
      values: [
        { name: 'M', label: 'Male' },
        { name: 'F', label: 'Female' },
        { name: 'O', label: 'Other' }
      ]
    },
    { name: 'height', label: 'Height' },
    { name: 'job', label: 'Job' }
  ]
};

const preparedQueries: { [key: string]: RuleGroupType } = {
  primary: {
    id: `g-${nanoid()}`,
    rules: [
      {
        id: `r-${nanoid()}`,
        field: 'firstName',
        value: 'Steve',
        operator: '='
      },
      {
        id: `r-${nanoid()}`,
        field: 'lastName',
        value: 'Vai',
        operator: '='
      }
    ],
    combinator: 'and',
    not: false
  },
  secondary: {
    id: `g-${nanoid()}`,
    rules: [
      {
        field: 'age',
        id: `r-${nanoid()}`,
        operator: '>',
        value: '28'
      },
      {
        field: 'isMusician',
        id: `r-${nanoid()}`,
        operator: '=',
        value: true
      },
      {
        field: 'instrument',
        id: `r-${nanoid()}`,
        operator: '=',
        value: 'Guitar'
      }
    ],
    combinator: 'or',
    not: false
  },
  generic: {
    id: `g-${nanoid()}`,
    combinator: 'and',
    not: false,
    rules: []
  }
};

const RootView = () => {
  const [query, setQuery] = useState<RuleGroupType>(preparedQueries.primary);
  const [fields, setFields] = useState<Field[]>(preparedFields.primary);
  const [format, setFormat] = useState<ExportFormat>('json');
  const [showCombinatorsBetweenRules, setShowCombinatorsBetweenRules] = useState(false);
  const [showNotToggle, setShowNotToggle] = useState(false);
  const [resetOnFieldChange, setResetOnFieldChange] = useState(true);
  const [resetOnOperatorChange, setResetOnOperatorChange] = useState(false);

  /**
   * Reloads a prepared query, a PoC for query updates by props change.
   * If no target is supplied, clear query (generic query).
   */
  const loadQuery = (target?: 'primary' | 'secondary') => {
    if (target) {
      setQuery(preparedQueries[target]);
      setFields(preparedFields[target]);
    } else {
      setQuery(preparedQueries.generic);
      setFields(preparedFields.generic);
    }
  };

  const handleQueryChange = (query) => {
    setQuery(query);
  };

  const formatString =
    format === 'json_without_ids'
      ? JSON.stringify(JSON.parse(formatQuery(query, { format }) as string), null, 2)
      : format === 'parameterized'
      ? JSON.stringify(formatQuery(query, { format }), null, 2)
      : formatQuery(query, { format });

  return (
    <div className="flex-box-outer">
      <div className="control-panel">
        <button onClick={() => loadQuery('primary')}>Load primary query</button>
        <button onClick={() => loadQuery('secondary')}>Load secondary query</button>
        <button onClick={() => loadQuery()}>Clear query</button>
      </div>
      <hr />
      <div className="flex-box">
        <div className="scroll">
          <QueryBuilder
            query={query}
            fields={fields}
            controlClassnames={{ fields: 'form-control' }}
            onQueryChange={handleQueryChange}
            showCombinatorsBetweenRules={showCombinatorsBetweenRules}
            showNotToggle={showNotToggle}
            resetOnFieldChange={resetOnFieldChange}
            resetOnOperatorChange={resetOnOperatorChange}
          />
        </div>
        <div className="shrink query-log scroll">
          <h4>Options</h4>
          <div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={showCombinatorsBetweenRules}
                  onChange={(e) => setShowCombinatorsBetweenRules(e.target.checked)}
                />
                Show combinators between rules
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={showNotToggle}
                  onChange={(e) => setShowNotToggle(e.target.checked)}
                />
                Show "not" toggle
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={resetOnFieldChange}
                  onChange={(e) => setResetOnFieldChange(e.target.checked)}
                />
                Reset rule on field change
              </label>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={resetOnOperatorChange}
                  onChange={(e) => setResetOnOperatorChange(e.target.checked)}
                />
                Reset rule on operator change
              </label>
            </div>
          </div>
          <h4>Query</h4>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
            <label>
              <input type="radio" checked={format === 'json'} onChange={() => setFormat('json')} />
              JSON
            </label>
            <label>
              <input
                type="radio"
                checked={format === 'json_without_ids'}
                onChange={() => setFormat('json_without_ids')}
              />
              JSON Without IDs
            </label>
            <label>
              <input type="radio" checked={format === 'sql'} onChange={() => setFormat('sql')} />
              SQL
            </label>
            <label>
              <input
                type="radio"
                checked={format === 'parameterized'}
                onChange={() => setFormat('parameterized')}
              />
              Parameterized
            </label>
          </div>
          <pre>{formatString}</pre>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<RootView />, document.querySelector('.container'));