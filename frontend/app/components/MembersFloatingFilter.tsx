// Floating Filter Component for Members Checkbox Filter
import React, { forwardRef, useImperativeHandle, useState } from 'react';

export default forwardRef((props: any, ref) => {
  const [currentState, setCurrentState] = useState<string>('');

  // The main filter will call this method when model changes
  useImperativeHandle(ref, () => {
    return {
      onParentModelChanged(parentModel: any) {
        // When the filter is cleared
        if (!parentModel) {
          setCurrentState('');
          return;
        }

        // When the filter is active
        setCurrentState(parentModel.state === 'members' ? 'Members Only' : 'Non-Members Only');
      }
    };
  });

  // Reset button to clear the filter
  const onButtonClick = () => {
    props.parentFilterInstance((instance: any) => {
      instance.setModel(null);
      // Let the grid know the filter was updated
      instance.filterChangedCallback();
    });
  };

  return (
    <div className="ag-floating-filter-body">
      <div className="ag-floating-filter-full-body">
        {currentState && (
          <div className="flex items-center gap-1">
            <span className="text-xs truncate">{currentState}</span>
            <button 
              className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xs" 
              onClick={onButtonClick}
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
});