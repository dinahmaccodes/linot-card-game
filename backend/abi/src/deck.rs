use crate::card::{Card, CardSuit, CardValue};

/// Deck type alias
pub type Deck = Vec<Card>;

/// Create a standard Whot deck (54 cards)
pub fn create_whot_deck() -> Deck {
    let mut deck = Vec::with_capacity(54);

    // Circle suit - 8 cards
    let circle_values = [
        CardValue::One, CardValue::Two, CardValue::Three, CardValue::Four,
        CardValue::Five, CardValue::Seven, CardValue::Eleven, CardValue::Fourteen,
    ];
    for &value in &circle_values {
        deck.push(Card { suit: CardSuit::Circle, value });
    }

    // Cross suit - 8 cards
    let cross_values = [
        CardValue::One, CardValue::Two, CardValue::Three, CardValue::Five,
        CardValue::Seven, CardValue::Ten, CardValue::Thirteen, CardValue::Fourteen,
    ];
    for &value in &cross_values {
        deck.push(Card { suit: CardSuit::Cross, value });
    }

    // Triangle suit - 10 cards
    let triangle_values = [
        CardValue::One, CardValue::Two, CardValue::Three, CardValue::Four,
        CardValue::Five, CardValue::Seven, CardValue::Ten, CardValue::Eleven,
        CardValue::Thirteen, CardValue::Fourteen,
    ];
    for &value in &triangle_values {
        deck.push(Card { suit: CardSuit::Triangle, value });
    }

    // Square suit - 8 cards
    let square_values = [
        CardValue::One, CardValue::Two, CardValue::Three, CardValue::Five,
        CardValue::Seven, CardValue::Ten, CardValue::Thirteen, CardValue::Fourteen,
    ];
    for &value in &square_values {
        deck.push(Card { suit: CardSuit::Square, value });
    }

    // Star suit - 13 cards
    let star_values = [
        CardValue::One, CardValue::Two, CardValue::Three, CardValue::Four,
        CardValue::Five, CardValue::Seven, CardValue::Eight, CardValue::Ten,
        CardValue::Eleven, CardValue::Twelve, CardValue::Thirteen, CardValue::Fourteen,
        CardValue::Eight, // Extra 8 for Star
    ];
    for &value in &star_values {
        deck.push(Card { suit: CardSuit::Star, value });
    }

    // Whot cards - 5 special cards
    for _ in 0..5 {
        deck.push(Card {
            suit: CardSuit::Circle, // Whot cards shown with Circle by convention
            value: CardValue::Whot,
        });
    }

    deck
}

/// Shuffle deck using block height for deterministic randomness (Option B)
pub fn shuffle_deck(deck: &mut Deck, block_height: u64) {
    let mut rng_state = block_height;
    
    // Fisher-Yates shuffle with deterministic LCG
    for i in (1..deck.len()).rev() {
        // Linear Congruential Generator for deterministic randomness
        rng_state = rng_state.wrapping_mul(1664525).wrapping_add(1013904223);
        let j = (rng_state as usize) % (i + 1);
        deck.swap(i, j);
    }
}
