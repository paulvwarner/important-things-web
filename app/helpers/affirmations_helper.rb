module AffirmationsHelper
  def create_affirmation(affirmation_attrs)
    Affirmation.create(
      {
        message: affirmation_attrs[:message],
        notes: affirmation_attrs[:notes]
      }
    )
  end
end
