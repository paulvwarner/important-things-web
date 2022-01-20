module CommitmentsHelper
  def create_commitment(commitment_attrs)
    Commitment.create(
      {
        title: commitment_attrs[:title],
        notes: commitment_attrs[:notes]
      }
    )
  end
end
