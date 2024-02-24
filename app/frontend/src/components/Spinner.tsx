import BeatLoader from 'react-spinners/BeatLoader';

const Spinner = () => {
  return (
    <BeatLoader
      speedMultiplier={0.75}
      size={5}
      loading={true}
      cssOverride={{ width: '30px', color: '#343541', margin: '0 auto' }}
    />
  );
};

export default Spinner;                    