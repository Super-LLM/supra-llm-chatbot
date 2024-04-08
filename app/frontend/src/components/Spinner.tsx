import SquareLoader from 'react-spinners/SquareLoader';

const Spinner = () => {
  return (
    <SquareLoader
      speedMultiplier={0.75}
      size={12}
      loading={true}
      cssOverride={{ width: '12px', color: '#343541', margin: '0 auto' }}
    />
  );
};

export default Spinner;                    