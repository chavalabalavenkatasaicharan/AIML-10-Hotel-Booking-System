import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchRooms, submitBooking, checkAvailability, formatINR } from '../api';

export default function Book() {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);

  // step: 'form' -> 'payment' -> 'confirmed'
  const [step, setStep] = useState('form');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [checkin, setCheckin] = useState(searchParams.get('checkin') || '');
  const [checkout, setCheckout] = useState(searchParams.get('checkout') || '');
  const [roomType, setRoomType] = useState(searchParams.get('room') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');

  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // mock payment fields
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentErrors, setPaymentErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRooms()
      .then(setRooms)
      .catch(() => setRooms([]));
  }, []);

  function clientSideValidate() {
    const nextErrors = {};

    if (fullName.trim() === '') {
      nextErrors.fullname = 'Please enter your name.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email.';
    }

    if (checkin === '') {
      nextErrors.checkin = 'Please pick a check-in date.';
    }

    const datesOk = checkin && checkout && new Date(checkout) > new Date(checkin);
    if (!datesOk) {
      nextErrors.checkout = 'Check-out must be after check-in.';
    }

    if (roomType === '') {
      nextErrors.room = 'Please choose a room type.';
    }

    return nextErrors;
  }

  // Step 1: validate booking details, check real availability, then
  // move to the payment screen (no API booking call yet - that only
  // happens after mock payment).
  async function handleDetailsSubmit(e) {
    e.preventDefault();

    const localErrors = clientSideValidate();
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      return;
    }
    setErrors({});
    setCheckingAvailability(true);

    try {
      const result = await checkAvailability({ room: roomType, checkin, checkout });
      if (!result.available) {
        setErrors({
          form: `Sorry, ${roomType} is fully booked for those dates. Please try different dates or another room.`
        });
        return;
      }
    } catch (err) {
      setErrors({ form: 'Could not check availability right now. Please try again.' });
      return;
    } finally {
      setCheckingAvailability(false);
    }

    setStep('payment');
  }

  function validatePayment() {
    const nextErrors = {};

    if (cardName.trim() === '') {
      nextErrors.cardName = 'Please enter the name on the card.';
    }

    const digitsOnly = cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(digitsOnly)) {
      nextErrors.cardNumber = 'Enter a valid 16-digit card number.';
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      nextErrors.expiry = 'Use MM/YY format.';
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      nextErrors.cvv = 'Enter a valid CVV.';
    }

    return nextErrors;
  }

  // Step 2: "pay", then actually submit the booking to the backend.
  async function handlePaySubmit(e) {
    e.preventDefault();

    const localPaymentErrors = validatePayment();
    if (Object.keys(localPaymentErrors).length > 0) {
      setPaymentErrors(localPaymentErrors);
      return;
    }
    setPaymentErrors({});
    setProcessing(true);

    try {
      const result = await submitBooking({
        fullName,
        email,
        checkin,
        checkout,
        roomType,
        guests
      });

      if (!result.ok) {
        setProcessing(false);
        setStep('form');
        setErrors(result.errors);
        return;
      }

      setConfirmation(result.data.message);
      setStep('confirmed');
    } catch (err) {
      setProcessing(false);
      setPaymentErrors({ form: 'Payment could not be processed. Please try again.' });
      return;
    }
    setProcessing(false);
  }

  function resetAll() {
    setFullName('');
    setEmail('');
    setCheckin('');
    setCheckout('');
    setRoomType('');
    setGuests('2');
    setCardName('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setErrors({});
    setPaymentErrors({});
    setConfirmation(null);
    setStep('form');
  }

  const selectedRoom = rooms.find((r) => r.name === roomType);

  let nights = 0;
  if (checkin && checkout) {
    const diff = new Date(checkout) - new Date(checkin);
    nights = diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  }
  const total = selectedRoom ? selectedRoom.price * (nights || 1) : 0;

  return (
    <>
      <div className="page-banner">
        <h1>Book Your Stay</h1>
        <p>Fill this out and we'll confirm by email within a day.</p>
      </div>

      <section className="booking-form-section">
        <div className="container">
          <div className="form-wrap">

            {/* STEP 1: booking details */}
            {step === 'form' && (
              <form noValidate onSubmit={handleDetailsSubmit}>
                <div className="form-row">
                  <div className={`form-group${errors.fullname ? ' invalid' : ''}`}>
                    <label htmlFor="fullname">Full Name</label>
                    <input
                      type="text"
                      id="fullname"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <div className="error-text">Please enter your name.</div>
                  </div>
                  <div className={`form-group${errors.email ? ' invalid' : ''}`}>
                    <label htmlFor="bemail">Email</label>
                    <input
                      type="email"
                      id="bemail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="error-text">Please enter a valid email.</div>
                  </div>
                </div>

                <div className="form-row">
                  <div className={`form-group${errors.checkin ? ' invalid' : ''}`}>
                    <label htmlFor="bcheckin">Check-in</label>
                    <input
                      type="date"
                      id="bcheckin"
                      value={checkin}
                      onChange={(e) => setCheckin(e.target.value)}
                    />
                    <div className="error-text">Please pick a check-in date.</div>
                  </div>
                  <div className={`form-group${errors.checkout ? ' invalid' : ''}`}>
                    <label htmlFor="bcheckout">Check-out</label>
                    <input
                      type="date"
                      id="bcheckout"
                      value={checkout}
                      onChange={(e) => setCheckout(e.target.value)}
                    />
                    <div className="error-text">Check-out must be after check-in.</div>
                  </div>
                </div>

                <div className="form-row">
                  <div className={`form-group${errors.room ? ' invalid' : ''}`}>
                    <label htmlFor="broom">Room Type</label>
                    <select
                      id="broom"
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                    >
                      <option value="">Select a room</option>
                      {rooms.map((r) => (
                        <option key={r.name} value={r.name}>
                          {r.name} — {formatINR(r.price)}/night
                        </option>
                      ))}
                    </select>
                    <div className="error-text">Please choose a room type.</div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="bguests">Guests</label>
                    <select id="bguests" value={guests} onChange={(e) => setGuests(e.target.value)}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </div>

                {errors.form && (
                  <p style={{ color: '#c0392b', fontSize: '13px', marginBottom: '10px' }}>
                    {errors.form}
                  </p>
                )}

                <button type="submit" className="form-submit-btn" disabled={checkingAvailability}>
                  {checkingAvailability ? 'Checking availability…' : 'Continue to Payment'}
                </button>
              </form>
            )}

            {/* STEP 2: mock payment */}
            {step === 'payment' && (
              <div className="payment-step">
                <div className="order-summary">
                  <h3>Order Summary</h3>
                  <div className="order-row">
                    <span>Room</span>
                    <span>{roomType}</span>
                  </div>
                  <div className="order-row">
                    <span>Check-in</span>
                    <span>{checkin}</span>
                  </div>
                  <div className="order-row">
                    <span>Check-out</span>
                    <span>{checkout}</span>
                  </div>
                  <div className="order-row">
                    <span>Guests</span>
                    <span>{guests}</span>
                  </div>
                  {selectedRoom && (
                    <div className="order-row total">
                      <span>Total ({nights || 1} night{(nights || 1) > 1 ? 's' : ''})</span>
                      <span>{formatINR(total)}</span>
                    </div>
                  )}
                </div>

                <form noValidate onSubmit={handlePaySubmit} className="payment-form">
                  <h3>Payment Details</h3>

                  <div className={`form-group${paymentErrors.cardName ? ' invalid' : ''}`}>
                    <label htmlFor="cardName">Name on Card</label>
                    <input
                      type="text"
                      id="cardName"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                    <div className="error-text">Please enter the name on the card.</div>
                  </div>

                  <div className={`form-group${paymentErrors.cardNumber ? ' invalid' : ''}`}>
                    <label htmlFor="cardNumber">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      maxLength="19"
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <div className="error-text">Enter a valid 16-digit card number.</div>
                  </div>

                  <div className="form-row">
                    <div className={`form-group${paymentErrors.expiry ? ' invalid' : ''}`}>
                      <label htmlFor="expiry">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiry}
                        maxLength="5"
                        onChange={(e) => setExpiry(e.target.value)}
                      />
                      <div className="error-text">Use MM/YY format.</div>
                    </div>
                    <div className={`form-group${paymentErrors.cvv ? ' invalid' : ''}`}>
                      <label htmlFor="cvv">CVV</label>
                      <input
                        type="password"
                        id="cvv"
                        placeholder="123"
                        value={cvv}
                        maxLength="4"
                        onChange={(e) => setCvv(e.target.value)}
                      />
                      <div className="error-text">Enter a valid CVV.</div>
                    </div>
                  </div>

                  {paymentErrors.form && (
                    <p style={{ color: '#c0392b', fontSize: '13px', marginBottom: '10px' }}>
                      {paymentErrors.form}
                    </p>
                  )}

                  <p className="mock-note">This is a demo — no real payment will be processed.</p>

                  <div className="payment-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setStep('form')}
                      disabled={processing}
                    >
                      Back
                    </button>
                    <button type="submit" className="form-submit-btn" disabled={processing}>
                      {processing ? 'Processing…' : `Pay ${selectedRoom ? formatINR(total) : ''} Now`}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: confirmation */}
            {step === 'confirmed' && (
              <div className={`confirmation-box show`}>
                <strong>Thanks — your booking is confirmed!</strong>
                <span>{confirmation}</span>
                <div style={{ marginTop: '16px' }}>
                  <button type="button" className="form-submit-btn" onClick={resetAll}>
                    Make Another Booking
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}