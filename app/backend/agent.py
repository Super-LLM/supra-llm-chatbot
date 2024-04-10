from typing import List

from langchain.agents import ZeroShotAgent, AgentExecutor
from langchain.memory import ConversationBufferWindowMemory
from langchain.tools import DuckDuckGoSearchRun
from langchain_core.prompts import PromptTemplate
from langchain_core.tools import Tool
from langchain_openai import AzureChatOpenAI
from langchain.chains import LLMChain
from tools import Hoas_appartment, Immigration_RP, Study_programme


def get_agent_tools() -> List[Tool]:
    """
    Forms the tools needed by the Finnish studying agent.
    The tools contain:
        Apartment assistant
        Resident permit assistant
        Study programme selection assistant
        Duckduckgo search assistant.
    Returns:
        A list of langchain Tools.
    """
    apartment_apply = Hoas_appartment()
    RP_apply = Immigration_RP()
    study_programme = Study_programme()
    ddg_search = DuckDuckGoSearchRun()

    tools = [
        Tool(
            name="Apartment assistant",
            func=apartment_apply.run,
            description="""
            Useful when you need to answer questions related to apply an apartment in Finland.
            """
        ),
        Tool(
            name="Resident permit assistant",
            func=RP_apply.run,
            description="""
            Useful when you need to answer questions related to apply a Finnish resident permit .
            """
        ),
        Tool(
            name="Study programme selection assistant",
            func=study_programme.run,
            description="""
            Useful when you need to answer questions related to select a study programme in Finland.
            """
        ),
        Tool(
            name="DuckDuckGo Search",
            func=ddg_search.run,
            description="Useful to browse information from the Internet."
        )

    ]

    return tools


def get_promt_prefix() -> str:
    """
    Retrieves the prompt template prefix for the agent for studying in Finland.
    Returns:
        The prompt prefix.
    """
    prefix = '''
    You are an assistant who is trying to help international students who want to study in Finland./
    Answer the following questions as best you can, but speaking in a kind and informative manner./
    If the query is related to apply apartment, you should use tool "Apartment assistant",
    if the query is related to resident permit, you should use tool "Resident permit assistant",
    if the query is related to study programme, you should use tool "Study programme selection assistant",
    If there is no matching answers, you should use too "DuckDuckGo Search" to search the information about content on webpages./
    '''
    return prefix


def get_prompt_suffix() -> str:
    """
    Retrieves the prompt template suffix for the agent for studying in Finland.
    Returns:
        The prompt suffix
    """
    suffix = """Begin! Remember to speak in a friendly and helpful way,/
    
    Question: {input}
    {agent_scratchpad}"""

    return suffix


def create_agent_prompt(tools: List[Tool]) -> PromptTemplate:
    """
    Creates a prompt template for the agent.
    Args:
        tools: A list of tools used in the prompt.

    Returns:
        An PromptTemplate instance.
    """
    prompt = ZeroShotAgent.create_prompt(
        tools,
        prefix=get_promt_prefix(),
        suffix=get_prompt_suffix(),
        input_variables=["input", "history" "agent_scratchpad"]
    )
    return prompt


def create_agent(llm: AzureChatOpenAI) -> AgentExecutor:
    """
    Creates an LLM agent for the given AzureChatOpenAI instance with tools for regard studying in Finland.
    Args:
        llm: The AzureChatOpenAI instance used in the agent.
    Returns:
        An agent executor that can be queried with question regarding studying in Finland.
    """
    tools = get_agent_tools()
    prompt = create_agent_prompt(tools)
    memory = ConversationBufferWindowMemory(k=0)
    llm_chain = LLMChain(llm=llm, prompt=prompt)
    agent = ZeroShotAgent(llm_chain=llm_chain, tools=tools, verbose=False, max_iterations=1)
    agent_chain = AgentExecutor.from_agent_and_tools(agent=agent, tools=tools, handle_parsing_errors=True, verbose=True,
                                                     memory=memory, return_source_documents=True)

    return agent_chain
