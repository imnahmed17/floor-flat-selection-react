import { useEffect, useState } from 'react';
import { MdOutlineSync } from 'react-icons/md';

function App() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [floors, setFloors] = useState(0);
  const [floor, setFloor] = useState(null);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [flats, setFlats] = useState(0);
  const [allFlats, setAllFlats] = useState([]);
  const [flatsArray, setFlatsArray] = useState([]);
  const [flat, setFlat] = useState(null);
  const [currentFlat, setCurrentFlat] = useState(null);
  const [selectedFlat, setSelectedFlat] = useState([]);
  const [availableFlats, setAvailableFlats] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isNaN(floors) || floors < 1) {
      setError('Floors must be greater than 0');
      return;
    } 
    
    if (isNaN(flats) || flats < 1) {
      setError('Flats must be greater than 0');
      return;
    } 

    const flatsArray = Array.from({ length: flats }, (_, index) => String.fromCharCode(65 + index));
    setFlatsArray(flatsArray);

    let flatNames = [];
    for (let floor = 1; floor <= floors; floor++) {
      let floorFlats = [];
      for (let flat = 0; flat < flats; flat++) {
        let flatName = `${floor}${String.fromCharCode(65 + flat)}`;
        floorFlats.push(flatName);
      }
      flatNames.push(floorFlats);
    }
    setAllFlats(flatNames);
    setAvailableFlats(flatNames);
    
    setSubmitted(true);
  };

  const generateRandomFloorFlat = () => {
    let randomNumber;
    let randomFlat;
    let newFlat;
    
    do {
      randomNumber = Math.floor(Math.random() * floors) + 1;
      randomFlat = flatsArray[Math.floor(Math.random() * flatsArray.length)];
      newFlat = `${randomNumber}${randomFlat}`;
    } while (selectedFlat.includes(newFlat));

    setFloor(randomNumber); 
    setFlat(randomFlat);
    
    setSelectedFlat((prevSelectedFlat) => {
      const updatedSelectedFlats = [...prevSelectedFlat, newFlat];
      const updatedAvailableFlats = allFlats.map(floor => 
        floor.filter(flat => !updatedSelectedFlats.includes(flat))
      );
      setAvailableFlats(updatedAvailableFlats); 
      return updatedSelectedFlats;
    });
  };

  useEffect(() => {
    if (floor !== null) {
      let count = 0;
      const interval = setInterval(() => {
        if (count < floors) {
          count++;
          setCurrentNumber(count); 
        }
      }, 1000 / floors); 

      const animationTimeout = setTimeout(() => {
        setCurrentNumber(floor); 
        clearInterval(interval); 
      }, 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(animationTimeout);
      };
    }
  }, [floors, floor]);

  useEffect(() => {
    if (flat !== null) {
      let count = 0;
      const interval = setInterval(() => {
        const randomFlat = flatsArray[Math.floor(Math.random() * flatsArray.length)];
        setCurrentFlat(randomFlat);
        count++;
        if (count === flats) {
          clearInterval(interval);
        }
      }, 1000 / flats); 

      const animationTimeout = setTimeout(() => {
        setCurrentFlat(flat);
        clearInterval(interval);
      }, 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(animationTimeout);
      };
    }
  }, [flats, flat, flatsArray]);

  return (
    <>
      <h1 className='mt-6 text-5xl font-semibold text-center'>Real State Floor Flat Selection</h1>
      <form 
        onSubmit={handleSubmit} 
        className='max-w-sm p-4 mx-auto mt-10 border rounded-md'
      >
        <div className='flex items-center justify-between'>
          <label htmlFor='floor'>No. of floors:</label>
          <input 
            type='text' 
            inputMode='numeric'
            id='floor' 
            name='floor' 
            min='1' 
            onChange={(e) => setFloors(e.target.value)}
            className='p-2 mb-2 border rounded-md'
            required
          />
        </div>
        <div className='flex items-center justify-between'>
          <label htmlFor='flat'>Flats each floor:</label>
          <input 
            type='text' 
            inputMode='numeric'
            id='flat' 
            name='flat' 
            min='1' 
            onChange={(e) => setFlats(e.target.value)}
            className='p-2 mb-2 border rounded-md'
            required
          />
        </div>
        <button 
          type='submit' 
          className='w-full p-2 font-medium text-white bg-green-500 rounded-md'
        >
          Submit
        </button>
        {error && <p className='mt-1 text-sm text-center text-red-500'>{error}</p>}
      </form>
      {submitted && (
        <>
          <div className='flex items-center max-w-6xl gap-4 mx-auto mt-10'>
            <div className='w-full p-4 border rounded-md'>
              <h1 className='mb-3 text-4xl font-medium text-center text-indigo-500'>Floor Selection</h1>
              {floor !== null && (
                <div className='text-lg text-center'>
                  <p className='text-2xl'>{currentNumber}</p>
                </div>
              )}
            </div>
            <div>
              <button 
                className='p-1 text-3xl text-green-500 rounded hover:bg-gray-200 disabled:bg-gray-300 disabled:text-red-500' 
                onClick={generateRandomFloorFlat}
                disabled={selectedFlat.length === floors * flats}
              >
                <MdOutlineSync />
              </button>
            </div>
            <div className='w-full p-4 border rounded-md'>
              <h1 className='mb-3 text-4xl font-medium text-center text-purple-500'>Flat Selection</h1>
              {flat !== null && (
                <div className='text-lg text-center'>
                  <p className='text-2xl'>{currentFlat}</p>
                </div>
              )}
            </div>
          </div>
          <div className='max-w-6xl mx-auto'>
            <p className='mt-6'>
              Flat selected: {selectedFlat.length > 1 ? selectedFlat.join(', ') : selectedFlat}
            </p>
            <p>No. of flats left: {(floors * flats) - selectedFlat.length}</p>
            <p>Flats left:</p>
            <div>
              {availableFlats.map((floorFlats, floorIndex) => (
                <p key={floorIndex}>
                  {floorFlats.map((flatName, flatIndex) => (
                    <span key={flatIndex} className='mr-4'>
                      {flatName}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
