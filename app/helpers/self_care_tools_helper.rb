module SelfCareToolsHelper
  def create_self_care_tool(self_care_tool_attrs)
    SelfCareTool.create(
      {
        title: self_care_tool_attrs[:title],
        notes: self_care_tool_attrs[:notes]
      }
    )
  end
end
