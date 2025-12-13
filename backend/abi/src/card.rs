use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::SimpleObject, PartialEq, Eq)]
pub struct Card {
    pub suit: CardSuit,
    pub value: CardValue,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, async_graphql::Enum, PartialEq, Eq, Hash)]
pub enum CardSuit {
    Circle,
    Cross,
    Triangle,
    Square,
    Star,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, async_graphql::Enum, PartialEq, Eq)]
pub enum CardValue {
    One,      // 1 - Hold On (special)
    Two,      // 2 - Pick Two (special)
    Three,    // 3
    Four,     // 4
    Five,     // 5 - Pick Three (special)
    Six,      // 6
    Seven,    // 7
    Eight,    // 8 - Suspension (special)
    Nine,     // 9
    Ten,      // 10
    Eleven,   // 11
    Twelve,   // 12
    Thirteen, // 13
    Fourteen, // 14 - General Market (special)
    Whot,     // 20 - Wild card (special)
}

impl CardValue {
    /// Get the numeric value for display/logic
    pub fn to_number(&self) -> u8 {
        match self {
            CardValue::One => 1,
            CardValue::Two => 2,
            CardValue::Three => 3,
            CardValue::Four => 4,
            CardValue::Five => 5,
            CardValue::Six => 6,
            CardValue::Seven => 7,
            CardValue::Eight => 8,
            CardValue::Nine => 9,
            CardValue::Ten => 10,
            CardValue::Eleven => 11,
            CardValue::Twelve => 12,
            CardValue::Thirteen => 13,
            CardValue::Fourteen => 14,
            CardValue::Whot => 20,
        }
    }

    /// Check if this is a special action card
    pub fn is_special(&self) -> bool {
        matches!(self, 
            CardValue::One | CardValue::Two | CardValue::Five | 
            CardValue::Eight | CardValue::Fourteen | CardValue::Whot
        )
    }
}
